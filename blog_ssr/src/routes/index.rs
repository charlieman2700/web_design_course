use rocket::fs::NamedFile;
use rocket::Route;
use rocket_dyn_templates::{context, Template};
use std::path::PathBuf;

pub fn get_index_routes() -> Vec<Route> {
    routes![login, files, homescreen, sign_up]
}

#[get("/homescreen")]
pub fn homescreen() -> Template {
    Template::render("HomeScreen/HomeScreen", context! {username: "Charlie"})
}

#[get("/")]
pub fn login() -> Template {
    Template::render("Login/Login", context! {})
}
#[get("/sign_up")]
pub fn sign_up() -> Template {
    Template::render("SignUp/SignUp", context! {})
}

#[get("/<file..>")]
async fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(std::path::Path::new("public/").join(file))
        .await
        .ok()
}
