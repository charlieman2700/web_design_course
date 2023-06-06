use crate::{DB, FIREBASE, TEMPLATES};

use crate::prisma::prisma;
use salvo::prelude::*;
use serde::{Deserialize, Serialize};

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

    match FIREBASE.refresh_id_token(&parsed.token_id).await {
        Ok(refresh_id_token_response) => {
            println!("refresh_id_token_response: {:?}", refresh_id_token_response);
        }
        Err(error) => {
            println!("Error en refresh_id_token: {:?}", error);
        }
    }

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
