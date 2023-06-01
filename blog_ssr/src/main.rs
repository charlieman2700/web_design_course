#[macro_use]
extern crate rocket;

mod routes;
mod handlebars_helpers;

use handlebars_helpers::firstCharUpper;
use rocket_dyn_templates::Template;
use routes::index::get_index_routes;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", get_index_routes())
        .attach(Template::custom(|engines| {
            engines
                .handlebars
                .register_helper("firstCharUpper", Box::new(firstCharUpper))
        }))
}
