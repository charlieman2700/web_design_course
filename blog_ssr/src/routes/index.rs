use rocket::fs::NamedFile;
use rocket::Route;
use rocket_dyn_templates::{context, Template};
use std::path::PathBuf;

pub fn get_index_routes() -> Vec<Route> {
    routes![index, hello, files, homescreen]
}
#[get("/homescreen")]
pub fn homescreen() -> Template {
    Template::render("HomeScreen/HomeScreen", context! {})
}

#[get("/")]
pub fn index() -> Template {
    Template::render("login/Login", context! {})
}

#[get("/isa")]
pub fn hello() -> Template {
    Template::render("indexPage/index", context! {name: "Isabella te amo"})
}

#[get("/<file..>")]
async fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(std::path::Path::new("public/").join(file))
        .await
        .ok()
}
