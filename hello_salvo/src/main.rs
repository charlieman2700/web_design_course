use salvo::prelude::*;
mod controllers;
#[allow(warnings, unused)]
mod prisma;
use async_once::AsyncOnce;
use controllers::{articles, auth};
use handlebars::Handlebars;
mod helpers;
use helpers::verify_session;

use salvo::serve_static::StaticDir;
#[macro_use]
extern crate lazy_static;

lazy_static! {
    pub static ref TEMPLATES: Handlebars<'static> = {
        println!("Loading templates");
        let mut hbs = Handlebars::new();
        hbs.set_dev_mode(true);
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
        .push(
            Router::with_path("auth")
                .push(
                    Router::with_path("sign_up")
                        .get(auth::signup_page)
                        .post(auth::sign_up),
                )
                .push(
                    Router::with_path("sign_in")
                        .post(auth::sign_in)
                        .get(auth::login_page),
                )
                .delete(auth::sign_out),
        )
        .push(
            Router::new()
                .hoop(verify_session)
                .get(articles::main_view)
                .push(Router::with_path("create_article").get(articles::create_article_view)),
        )
        .push(Router::with_path("<**path>").get(StaticDir::new(["public"])));

    let acceptor = TcpListener::new("127.0.0.1:8000").bind().await;
    Server::new(acceptor).serve(router).await;
}
