use rocket::Route;

pub fn obtain_auth_routes() -> Vec<Route> {
    routes![login]
}

#[post("/login", data = "<login_data>")]
pub fn login(login_data: String) {
    println!("{}", login_data);
}

