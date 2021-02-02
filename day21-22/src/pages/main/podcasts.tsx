import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { getAllPodcasts } from "../../codegen/getAllPodcasts";

export const GET_ALL_PODCASTS = gql`
  query getAllPodcasts {
    getAllPodcasts {
      ok
      error
      podcasts {
        id
        title
        createdAt
        updatedAt
        category
        rating
      }
    }
  }
`;

export const PodcastsPage = () => {
  const { data, loading } = useQuery<getAllPodcasts>(GET_ALL_PODCASTS);

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  const getDate = (date_string: string) => {
    const date = new Date(date_string);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`;
  };

  return (
    <div className="bg-gray-900 h-screen text-white">
      {data.getAllPodcasts.podcasts?.map(podcast => (
        <Link key={podcast.id} to={`/podcast/${podcast.id}`}>
          <div className="p-4 border-t border-b border-gray-600">
            <div className="flex">
              <img
                src="podcast.svg"
                className="w-16 bg-gray-800 rounded-lg p-2"
              />
              <div className="ml-4">
                <div className="text-xl font-medium">{podcast.title}</div>
                <div className="text-xs text-gray-50 mt-1">
                  CreateAt {getDate(podcast.createdAt)}
                </div>
                <div className="text-xs text-gray-50 mt-1">
                  UpdateAt {getDate(podcast.updatedAt)}
                </div>
              </div>
            </div>
            <div className="flex mt-4 items-center">
              <div className="py-1 px-4 border border-gray-600 rounded-full">
                {podcast.category}
              </div>
              <div className="ml-4">⭐️ {podcast.rating}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
