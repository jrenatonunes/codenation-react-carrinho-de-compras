const promotions = ["SINGLE LOOK", "DOUBLE LOOK", "TRIPLE LOOK", "FULL LOOK"];


// Retornar um array de produtos com todos os dados de cada produto do carrinho
// Utiliza o array de ids para encontrar os produtos na lista de produtos existente
const getProductsCartList = (ids, productsList) =>
  ids.map((productId) =>
    productsList.find((product) => product.id == productId)
  );


// Retorna um array com todas as categorias dos produtos do carrinho
const getCategories = (productCartList) =>
  productCartList.map((product) => product.category.toUpperCase());


// Retiorna um array com todas categorias dos produtos de forma única, sem repetição de categoria
// Funconamento similar ao tipo Set (Conjunto)
const getUniqueCategories = (categories) =>
  categories.reduce((uniqueCategories, category) => {
    return uniqueCategories.includes(category)
      ? uniqueCategories
      : [...uniqueCategories, category];
  }, []);


// Retorna a promoção com base nas categorias
const getPromotionByCategories = (productCartList) => {
  let categories = getCategories(productCartList);
  let uniqueCategories = getUniqueCategories(categories);
  let numCategories = uniqueCategories.length;
  return promotions[numCategories - 1];
};


// Retorna o preço padrão de um determinado produto
const getRegularPrice = (product) => parseFloat(product.regularPrice);


// Retorna o preço promocional de um determinado produto
// Não existindo preço promocional, retorna o preço padrão
const getPromotionPriceByLook = (product, look) => {
  let looksByPromotion = product.promotions;
  let priceByLook = looksByPromotion.find((promotion) =>
    promotion.looks.includes(look)
  );

  // Retorna o preço promocional, caso exista, ou o preço regular, caso não exista
   if ( priceByLook ) {
    return parseFloat(priceByLook.price);
  }
  return getRegularPrice(product);
};


// Retorna um objeto contendo os elementos nome ecategoria
// Será utilizado para compor o array de produtos
const getProductNameAndCategory = (product) => ({
  name: product.name,
  category: product.category,
});


// Retorna um array com todos os produtos do carrinho formatado
const getProductsCartFormated = (productCartList) => {
  let products = productCartList.map((product) =>
    getProductNameAndCategory(product)
  );
  return { products };
};


// Realiza os cálculos dos preços e retorna um objeto com os elementos totalPrice e totalRegularPrice
// Será utilizado pra compor o objeto com todos os produtos do carrinho, preços e descontos
const getTotalPrices = (productCartList) => {
  let totalRegularPrice = (totalPromotionPrice = 0.0);
  let look = getPromotionByCategories(productCartList);

  // Realiza a soma dos preços regulares e promocionais
  productCartList.forEach((product) => {
    totalRegularPrice += getRegularPrice(product);
    totalPromotionPrice += getPromotionPriceByLook(product, look);
  });

  totalRegularPrice = totalRegularPrice.toFixed(2);
  totalPromotionPrice = totalPromotionPrice.toFixed(2);

  return {
    totalPrice: `${totalPromotionPrice}`,
    totalRegularPrice: `${totalRegularPrice}`,
  };
};


// Realiza os cálculos do descontos e retorna um objeto com os elementos discountValue e discount
// Será utilizado pra compor o objeto com todos os produtos do carrinho, preços e descontos
const getTotalDiscount = (totalRegularPrice, totalPromotionPrice) => {
  let totalDiscountValue = (percentDiscountValue = 0.0);
  let discount = "";

  totalDiscountValue = (totalRegularPrice - totalPromotionPrice).toFixed(2);
  percentDiscountValue = ((totalDiscountValue / totalRegularPrice) * 100).toFixed(2);

  discountValue = `${totalDiscountValue}`;
  discount = `${percentDiscountValue}%`;

  return {
    discountValue,
    discount,
  };
};


// Retorna um objeto com detalhes de nome e categoria dos produtos do carrinho,
// tipo da promoção, preços e descontos
const getShoppingCart = (ids, productsList) => {
  let productsCartList = getProductsCartList(ids, productsList);
  let { products } = getProductsCartFormated(productsCartList);
  let promotion = getPromotionByCategories(productsCartList);
  let { totalPrice, totalRegularPrice } = getTotalPrices(productsCartList);
  let { discountValue, discount } = getTotalDiscount(totalRegularPrice, totalPrice);

  return {
    products,
    promotion,
    totalPrice,
    discountValue,
    discount,
  };
};

module.exports = { getShoppingCart };
