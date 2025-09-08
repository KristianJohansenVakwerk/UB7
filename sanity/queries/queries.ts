export const baseSectionQuery = `*[_type in ["sectionPortfolio", "sectionAbout", "sectionContact"]] | order(
  select(
    _type == "sectionPortfolio" => 1,
    _type == "sectionAbout" => 2,
    _type == "sectionContact" => 3
  )
) {
  _type,
  _id,
  "title": title,
  "headline": headline,
  ...select(
    _type == "sectionAbout" => {
      "text": text
    },
    _type == "sectionContact" => {
      "social": social,
      "email": email,
      "address": address
    }
  )
  
}`;

export const portfolioSectionQuery = `{
  "portfolio": *[_type == "portfolioCategory"] | order(orderRank) {
    "title": title,
    "media": media.asset->{...},
    "entries": *[_type == 'portfolio' &&  category._ref == ^._id ] {
      "title": title,
      slug,
      "sector": ^.title,
      "text": text,
      "details": details[] {
        _key,
        "title": title,
        "value": value
      },
       "socials": social[] {
          _key,
        "title": platform,
        "url": url
      },
      "slides": slides[] {
        "asset": asset->{...}
      },
    }
  }
}`;

export const aboutSectionQuery = `{
  
  "team": *[_type == 'teamMember'] | order(orderRank) {
  _type,
  _id,
  "name": name,
  "description": description,
  "image": image.asset->{...},
  "links": links[] {
    "title": title,
    "link": link
  }
  }
}`;

export const contactSectionQuery = `{}`;

export const sectionsQuery = `${baseSectionQuery} {
...,
...select(
  _type == 'sectionPortfolio' => ${portfolioSectionQuery},
  _type == 'sectionAbout' => ${aboutSectionQuery},
  _type == 'sectionContact' => ${contactSectionQuery}
)
}`;
