use std::vec;

use crate::prisma::prisma::{self, post, post_category, user};
use crate::{DB, TEMPLATES};
use salvo::prelude::*;
use serde::Deserialize;
use serde_json::json;

#[handler]
pub async fn create_article_view(res: &mut Response) {
    let categories: Vec<post_category::Data> = DB
        .get()
        .await
        .post_category()
        .find_many(vec![])
        .exec()
        .await
        .unwrap();

    let rendered_template =
        TEMPLATES.render("CreateArticlesLogged", &json!({ "categories": categories }));

    let rendered_template = match rendered_template {
        Ok(rendered_template) => rendered_template,
        Err(e) => {
            println!("Error rendering template: {}", e);
            return;
        }
    };

    res.render(Text::Html(rendered_template))
}

#[handler]
pub async fn create_article() {

    // let post = DB.get().await.post().create(title, abstract, image_link, content, user, params).exec().await;
}

// #[handler]
// pub async fn create_article(){

// let post = DB.get().await.post().create(title, abstract, image_link, content, user, params).exec().await;

// }

#[handler]
pub async fn main_view(req: &mut Request, res: &mut Response, depot: &mut Depot) {
    let user = depot.get::<fireauth::api::User>("user").unwrap();

    let user_from_database: Option<user::Data> = DB
        .get()
        .await
        .user()
        .find_unique(user::email::equals(user.email.clone()))
        .exec()
        .await
        .unwrap();

    let posts: Vec<post::Data> = DB
        .get()
        .await
        .post()
        .find_many(vec![])
        .take(5)
        .exec()
        .await
        .unwrap();

    let categories: Vec<prisma::post_category::Data> = DB
        .get()
        .await
        .post_category()
        .find_many(vec![])
        .take(5)
        .exec()
        .await
        .unwrap();

    let users_that_have_posts: Vec<user::Data> = DB
        .get()
        .await
        .user()
        .find_many(vec![])
        .take(5)
        .exec()
        .await
        .unwrap();

    let rendered = TEMPLATES
        .render(
            "HomeScreen",
            &json!({
                "user": user_from_database,
                "posts": posts,
                "categories": categories,
                "users_that_have_posts": users_that_have_posts,
            }),
        )
        .ok()
        .expect("Failed to render template");

    res.render(Text::Html(rendered));
}
