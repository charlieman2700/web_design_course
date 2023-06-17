use crate::{DB, TEMPLATES};

use crate::prisma::prisma;
use salvo::http::cookie::time::OffsetDateTime;
use salvo::http::cookie::Cookie;
use salvo::prelude::*;
use serde::Deserialize;
use std::result::Result::Err;

use crate::helpers;

#[handler]
pub async fn login_page(_: &mut Request, res: &mut Response) {
    res.render(Text::Html(TEMPLATES.render("Login", &()).unwrap()));
}

#[handler]
pub async fn signup_page(_: &mut Request, res: &mut Response) {
    res.render(Text::Html(TEMPLATES.render("SignUp", &()).unwrap()));
}

#[handler]
pub async fn sign_out(req: &mut Request, res: &mut Response) {
    res.add_cookie(
        Cookie::build("token_id", "")
            .path("/")
            .expires(OffsetDateTime::now_utc())
            .http_only(true)
            .finish(),
    );
    res.render(Redirect::other("/"))
}

#[derive(Deserialize)]
struct TokenId {
    token_id: String,
}

#[handler]
pub async fn sign_in(req: &mut Request, res: &mut Response) {
    println!("\n Im on post sign in \n");
    let parsed = req.parse_json::<TokenId>().await;
    let parsed = match parsed {
        Ok(parsed_file) => parsed_file,
        Err(err) => {
            res.render(Redirect::other("/"));
            return;
        }
    };

    res.add_cookie(
        Cookie::build("token_id", parsed.token_id)
            .path("/")
            .http_only(true)
            .finish(),
    );
}

#[derive(Deserialize)]
struct SignUpForm {
    name: String,
    token_id: String,
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

    let token_is_valid = helpers::verify_firebase_jwt(&parsed.token_id).await;
    let user = match token_is_valid {
        Ok(user) => user,
        Err(_err) => {
            res.status_code(StatusCode::BAD_REQUEST);
            return;
        }
    };

    let name = parsed.name;
    let email: String = user.email;
    DB.get()
        .await
        .user()
        .create(prisma::UserType::Person, name, email, vec![])
        .exec()
        .await
        .unwrap();

    res.add_cookie(
        Cookie::build("token_id", parsed.token_id)
            .path("/")
            .http_only(true)
            .finish(),
    );
}
