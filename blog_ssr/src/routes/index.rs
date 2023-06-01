use rocket::fs::NamedFile;
use rocket::Route;
use rocket_dyn_templates::{context, Template};
use std::path::PathBuf;

pub fn get_index_routes() -> Vec<Route> {
    routes![index, files, homescreen]
}
#[get("/homescreen")]
pub fn homescreen() -> Template {
    Template::render("HomeScreen/HomeScreen", context! {username: "Charlie"})
}

#[get("/")]
pub fn index() -> Template {
    Template::render("login/Login2", context! {})
}

#[get("/<file..>")]
async fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(std::path::Path::new("../public/").join(file))
        .await
        .ok()
}