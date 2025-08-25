export const sectionsQuery = `*[_type in ["sectionPortfolio", "sectionAbout", "sectionContact"]] | order(
  select(
    _type == "sectionPortfolio" => 1,
    _type == "sectionAbout" => 2,
    _type == "sectionContact" => 3
  )
) {
  _type,
  _id,
  "title": title.en,
  ...select(
    _type == 'sectionPortfolio' => {
      "test": 'test'
    }
  )
}`;

export const portfolioQuery = `*[_type == "portfolioCategory"] {
  "title": title.en,
  "media": media.asset->{...},
  "entries": *[_type == 'portfolio' &&  category._ref == ^._id ] {
    "title": title.en,
      slug,
      "sector": ^.title.en,
      "details": details[] {
        _key,
        "title": title.en,
        "value": value.en
      },
    "socials": social[] {
        _key,
      "title": platform.en,
      "url": url
    },
      "slides": slides[] {
        "asset": asset->{...}
      },
    "text": text.en,
    
  }
}`;
