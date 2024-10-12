'use client';

import Loader from "@/components/Loader";
import { Navigation } from "@/components/Navigation";
import { useAppContext } from "@/context/AppContext";
import { centsToDollars } from "@/utils/centsToDollars";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";


export default function Restaurant() {
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
      variables: { documentId: id },
    });
  
    if (error) return "Error Loading Dishes";
    if (loading) return <Loader />;

    if (data.restaurant.dishes.length) {
      const { restaurant } = data;
  
      return (
        <div className="py-6">
          <Navigation />
          <h1 className="text-4xl font-bold text-yellow-600">
            {restaurant.name}
          </h1>
          <div className="py-16 px-8 bg-white rounded-3xl">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap -m-4 mb-6">
                {restaurant.dishes.map((res) => {
                  return <DishCard key={res.id} data={res} />;
                })}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <h1>No Dishes Found</h1>;
    }
  }

  function DishCard({ data }) {
    const { addItem, setShowCart } = useAppContext();

    function handleAddItem() {
      addItem(data);
      setShowCart(true);
    }
  
    return (
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <div className="h-full bg-gray-100 rounded-2xl">
          <img
            className="w-full rounded-2xl"
            height={300}
            width={300}
            src={process.env.NEXT_PUBLIC_API_URL + data.image.url}
            alt=""
          />
          <div className="p-8">
            <div className="group inline-block mb-4">
              <h3 className="font-heading text-xl text-gray-900 hover:text-gray-700 group-hover:underline font-black">
                {data.name}
              </h3>
              <h2>${centsToDollars(data.price)}</h2>
            </div>
            <p className="text-sm text-gray-500 font-bold">
              {data.description}
            </p>
            <div className="flex flex-wrap md:justify-center -m-2">
              <div className="w-full md:w-auto p-2 my-6">
                <button
                  className="block w-full px-12 py-3.5 text-lg text-center text-white font-bold bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 rounded-full"
                  onClick={handleAddItem}
                >
                  + Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const GET_RESTAURANT_DISHES = gql`
  query ($documentId: ID!) {
    restaurant(documentId: $documentId) {
      name
      description
      image {
        documentId
        url
      }
      dishes {
        documentId
        name
        description
        price
        image {
          url
        }
      }
    }
  }
`;