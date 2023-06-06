use salvo::prelude::*;
use crate::TEMPLATES;
#[handler]
pub async fn view(_: &mut Request, res: &mut Response) {
    let rendered = TEMPLATES.render("HomeScreen", &())
        .ok()
        .expect("Failed to render template");
    
    // let section_two = SectionTwo {c: "Hello, world C!", d: "Hello, world D!"};
    // let result = section_two.render().unwrap().as_str().to_owned();

    // let hs_logged = LoggedTemplate {
        // _left_column: ContentLeftColumn {_content: "Hello, world!"},
        // _right_column: ContentRightColumn {_content: "Hello, world Righ!"},
        // _section_two: &result,
    // };
    
    res.render(Text::Html(rendered));
}
