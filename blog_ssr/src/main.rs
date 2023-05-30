#[macro_use]
extern crate rocket;

use rocket_dyn_templates::{context, Template};
mod routes;
use routes::index::get_index_routes;



// #[get("/")]
// fn index() -> Template {
//     Template::render("indexPage/index", context! {name: "World"})
// }

#[get("/")]
fn inner() -> &'static str {
    "Inner"
}


#[launch]
fn rocket() -> _ {
    rocket::build()
        //Add the files routes to the output of get_index_routes() dinamicly
        //
        .mount("/", get_index_routes() )
        .mount("/inner", routes![inner])
        .attach(Template::fairing())
}
