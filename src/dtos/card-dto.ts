import { cardAttributes } from 'models/card'

class CardDto {

    id: cardAttributes['id'];
    term: cardAttributes['term'];
    definition: cardAttributes['definition'];
    isFavorite: cardAttributes['is_favorite']
    imgUrl: cardAttributes['img_url']

    constructor(model: cardAttributes) {
        this.id = model.id;
        this.term = model.term;
        this.definition = model.definition;
        this.isFavorite = model.is_favorite;
        this.imgUrl = model.img_url
    }
}

export default CardDto