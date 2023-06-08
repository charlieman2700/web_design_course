use crate::{DB, TEMPLATES};

use crate::prisma::prisma;
use jsonwebtokens as jwt;
use jwt::raw::TokenSlices;
use jwt::{raw, Algorithm, AlgorithmID, Verifier};
use salvo::prelude::*;
use serde::{Deserialize, Serialize  };
use serde_json;

// use chrono::{Datelike, Timelike, Utc};

#[derive(Serialize, Deserialize)]
struct Claims {
    exp: usize, // Required (validate_exp defaults to true in validation). Expiration time (as UTC timestamp)
    iat: usize, // Optional. Issued at (as UTC timestamp)
    aud: String, // Optional. Audience
    iss: String, // Optional. Issuer
    sub: String, // Optional. Subject (whom token refers to)
    auth_time: usize, // Optional. Not Before (as UTC timestamp)
}


pub fn verify_firebase_jwt(token: &String) {
    let TokenSlices {
        message,
        signature,
        header,
        claims,
    } = raw::split_token(token).unwrap();

    let headers = raw::decode_json_token_slice(header).unwrap();

    let payload  = raw::decode_json_token_slice(claims).unwrap();
    let claims: Claims = serde_json::from_value(payload).unwrap();
    println!();
    println!("value: {:?}", claims.iss);
    println!("aud: {:?}", claims.aud);
    println!();


    // println!("value: {:?}", claims.get("exp"));
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
