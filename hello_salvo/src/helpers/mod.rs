use fireauth;
use fireauth::api::User;
use salvo::prelude::*;
use std::result::Result::{self, Err};

#[derive(Debug)]
pub enum JWTError {
    InvalidToken,
}

pub async fn verify_firebase_jwt(token: &String) -> Result<User, JWTError> {
    let api_key: String = String::from("AIzaSyBvmnMkFLvLblR5PG_9-MZowokyCGJf8pA");
    let auth = fireauth::FireAuth::new(api_key);
    match auth.get_user_info(token).await {
        Ok(user) => {
            return Ok(user);
        }
        Err(error) => {
            println!("Error: {}", error);
            return Err(JWTError::InvalidToken);
        }
    }
}

#[handler]
pub async fn verify_session(req: &mut Request, res: &mut Response, depot: &mut Depot) {
    println!("\n Verificando sesion \n");
    let token_cookie = req.cookies().get("token_id");
    let token_cookie = match token_cookie {
        Some(token_cookie) => token_cookie,
        None => {
            println!("No hay cookie de token");
            res.render(Redirect::other("/auth/sign_in"));
            return;
        }
    };

    let token_cookie_value = token_cookie.value();

    let token_is_valid = verify_firebase_jwt(&token_cookie_value.to_string()).await;
    let user = match token_is_valid {
        Ok(user) => user,
        Err(_err) => {
            println!("Error Token no es valido");
            res.render(Redirect::other("/auth/sign_in"));
            return;
        }
    };

    depot.insert("user", user);
}
