import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
  }
};

type HomeProps = {
  products: Product[];
};

const Home: NextPage<HomeProps> = ({ products }) => {
  console.log(products)

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState('');

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSortBy = (sortBy: string) => {
    setSortBy(sortBy);
    let sortedProducts = [...filteredProducts];

    if (sortBy === 'price-low-to-high') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-to-low') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-low-to-high') {
      sortedProducts.sort((a, b) => a.rating.rate - b.rating.rate);
    } else if (sortBy === 'rating-high-to-low') {
      sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
    }
    setFilteredProducts(sortedProducts);
  };

  return (

    <div>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by product title or category"
          className="flex-1 px-4 py-2 border-gray-300 border focus:outline-none focus:ring focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select
          className="ml-4 px-4 py-2 border-gray-300 border focus:outline-none focus:ring focus:border-blue-500"
          value={sortBy}
          onChange={(e) => handleSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-low-to-high">Price: Low to High</option>
          <option value="price-high-to-low">Price: High to Low</option>
          <option value="rating-low-to-high">Rating: Low to High</option>
          <option value="rating-high-to-low">Rating: High to Low</option>
        </select>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 shadow-md">
              <img
                src={product.image}
                alt={product.title}
                className="h-32 object-contain mb-4"
              />
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-gray-700">${product.price}</p>
              <p className="text-gray-500">{product.category}</p>
              <p>Rating : {product.rating.rate}</p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products/category/women's%20clothing");
    const products = await response.json();
    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        products: [],
      },
    };
  }
};




