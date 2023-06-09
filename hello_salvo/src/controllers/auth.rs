use crate::{DB, TEMPLATES};

use crate::prisma::prisma;
use jsonwebtokens as jwt;
use jwt::raw::TokenSlices;
use jwt::{raw, Algorithm, AlgorithmID, Verifier};
use reqwest;
use salvo::hyper::http::response;
use salvo::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json;
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};

// use chrono::{Datelike, Timelike, Utc};
//

fn validate_jwt_dates(exp: u64, iat: u64, auth_time: u64) -> bool {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    if now > exp {
        return false;
    }
    if now < iat {
        return false;
    }
    if now < auth_time {
        return false;
    }
    return true;
}

#[derive(Serialize, Deserialize)]
struct FirebaseJWTPayload {
    exp: u64, // Required (validate_exp defaults to true in validation). Expiration time (as UTC timestamp)
    iat: u64, // Optional. Issued at (as UTC timestamp)
    aud: String, // Optional. Audience
    iss: String, // Optional. Issuer
    sub: String, // Optional. Subject (whom token refers to)
    auth_time: u64, // Optional. Not Before (as UTC timestamp)
}

pub async fn verify_firebase_jwt(token: &String) -> bool {
    let TokenSlices {
        message,
        signature,
        header,
        claims,
    } = raw::split_token(token).unwrap();

    let payload: FirebaseJWTPayload = serde_json::from_str(claims).unwrap();
    let headers = raw::decode_json_token_slice(header).unwrap();
    if headers.get("alg").unwrap() != "RS256" {
        println!("Error: JWT alg is not RS256");
        return false;
    }

    let kid = headers.get("kid").unwrap();

    let url =
        "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

    let googe_firebase_public_keys_response = reqwest::get(url).await;
    let googe_firebase_public_keys_response = match googe_firebase_public_keys_response {
        Ok(value) => value,
        Err(error) => {
            println!("Error: {}", error);
            return false;
        }
    };

    if googe_firebase_public_keys_response.status() != 200 {
        println!(
            "Error: Google Firebase Public Keys Response Status Code: {}",
            googe_firebase_public_keys_response.status()
        );
        return false;
    }
    let firebase_public_keys = googe_firebase_public_keys_response
        .json::<HashMap<String, String>>()
        .await
        .unwrap();

    // Verify
    let kid_match = firebase_public_keys.values().any(|value| value == kid);
    if !kid_match {
        println!("Error: JWT kid is not valid");
        return false;
    }

    if !validate_jwt_dates(payload.exp, payload.iat, payload.auth_time) {
        println!("Error: JWT dates are not valid");
        return false;
    }
    return true;
}

#[handler]
pub async fn login_page(_: &mut Request, res: &mut Response) {
    res.render(Text::Html(TEMPLATES.render("login/Login", &()).unwrap()));
}

#[handler]
pub async fn signup_page(_: &mut Request, res: &mut Response) {
    res.render(Text::Html(TEMPLATES.render("SignUp/SignUp", &()).unwrap()));
}

#[derive(Deserialize)]
struct TokenId {
    token_id: String,
    email: String,
}

#[handler]
pub async fn sign_in(req: &mut Request, res: &mut Response) {
    let parsed = req.parse_json::<TokenId>().await;
    let parsed = match parsed {
        Ok(parsed_file) => parsed_file,
        Err(err) => {
            println!("Error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST);
            return;
        }
    };
    let token_id = parsed.token_id;
    verify_firebase_jwt(&token_id);

    res.render(Redirect::permanent("/app"));
    // let signup_template = SignUpTemplate{};
    // res.render(Text::Html(signup_template.render().unwrap()));
}

#[derive(Deserialize)]
struct SignUpForm {
    token_id: String,
    email: String,
    name: String,
}

#[handler]
pub async fn sign_up(req: &mut Request, res: &mut Response) {
    // Retreive data
    let parsed = req.parse_json::<SignUpForm>().await;
    let parsed = match parsed {
        Ok(parsed_file) => parsed_file,
        Err(err) => {
            println!("Error: {}", err);
            res.status_code(StatusCode::BAD_REQUEST);
            return;
        }
    };

    let name = parsed.name;
    let password: String = "carlos.lace.com".to_string();
    let email: String = parsed.email;
    DB.get()
        .await
        .user()
        .create(
            prisma::UserType::Person,
            name,
            email.clone(),
            password,
            vec![],
        )
        .exec()
        .await
        .unwrap();
    Redirect::permanent("/");
}
