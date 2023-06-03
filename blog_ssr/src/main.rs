#[macro_use]
extern crate rocket;

mod handlebars_helpers;
mod routes;

use handlebars_helpers::firstCharUpper;
use rocket_dyn_templates::Template;
use routes::auth::obtain_auth_routes;
use routes::index::get_index_routes;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", get_index_routes())
        .mount("/auth/", obtain_auth_routes())
        .attach(Template::custom(|engines| {
            engines
                .handlebars
                .register_helper("firstCharUpper", Box::new(firstCharUpper))
        }))
}
