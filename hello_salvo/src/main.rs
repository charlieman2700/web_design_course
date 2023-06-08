use salvo::prelude::*;
mod controllers;
#[allow(warnings, unused)]
mod prisma;
use async_once::AsyncOnce;
use controllers::{auth, home_screen};
use handlebars::Handlebars;

use salvo::serve_static::StaticDir;
#[macro_use]
extern crate lazy_static;

lazy_static! {
    pub static ref TEMPLATES: Handlebars<'static> = {
        println!("Loading templates");
        let mut hbs = Handlebars::new();
        hbs.register_templates_directory(".hbs", "src/views")
            .ok()
            .expect("Failed to register templates");

        for (t, _) in hbs.get_templates() {
            println!("Template: {}", t);
        }
        hbs
    };
    pub static ref DB: AsyncOnce<prisma::prisma::PrismaClient> = AsyncOnce::new(async {
        let client = prisma::prisma::new_client().await.unwrap();
        client
    });
}
#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().init();

    let router = Router::new()
        .hoop(Logger::new())
        .get(auth::login_page)
        .push(
            Router::with_path("auth")
                .push(
                    Router::with_path("sign_up")
                        .get(auth::signup_page)
                        .post(auth::sign_up),
                )
                .push(Router::with_path("sign_in").post(auth::sign_in)),
        )
        .push(
            Router::with_path("app")
                .post(home_screen::view)
                .get(home_screen::view),
        )
        .push(Router::with_path("<**path>").get(StaticDir::new(["public"])));

    let acceptor = TcpListener::new("127.0.0.1:3000").bind().await;
    Server::new(acceptor).serve(router).await;
}
