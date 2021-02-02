import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { getPodcast, getPodcastVariables } from "../../codegen/getPodcast";
import {
  toggleSubscribe,
  toggleSubscribeVariables,
} from "../../codegen/toggleSubscribe";
import { useMe } from "../../hooks/useMe";

export const GET_PODCAST = gql`
  query getPodcast($input: PodcastSearchInput!) {
    getPodcast(input: $input) {
      ok
      error
      podcast {
        id
        title
        createdAt
        updatedAt
        category
        rating
        episodes {
          id
          title
          category
          createdAt
        }
      }
    }
  }
`;

export const TOGGLE_SUBSCRIBE = gql`
  mutation toggleSubscribe($input: ToggleSubscribeInput!) {
    toggleSubscribe(input: $input) {
      ok
      error
    }
  }
`;

interface IPodcastParams {
  id: string;
}

export const PodcastPage = () => {
  const { data: user, refetch } = useMe();
  const params = useParams<IPodcastParams>();
  const { data, loading } = useQuery<getPodcast, getPodcastVariables>(
    GET_PODCAST,
    { variables: { input: { id: +params.id } } }
  );
  const onCompleted = (data: toggleSubscribe) => {
    const {
      toggleSubscribe: { ok },
    } = data;

    if (ok && user) {
      refetch();
    }
  };
  const [toggleSubscribe, { loading: subscribeLoading }] = useMutation<
    toggleSubscribe,
    toggleSubscribeVariables
  >(TOGGLE_SUBSCRIBE, {
    onCompleted,
  });

  if (loading && !data) {
    return <div>Loading...</div>;
  }

  const getDate = (date_string: string) => {
    const date = new Date(date_string);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`;
  };

  const onToggleSubscribeClick = () => {
    if (!subscribeLoading && data?.getPodcast.podcast?.id) {
      toggleSubscribe({
        variables: { input: { podcastId: data.getPodcast.podcast.id } },
      });
    }
  };

  const isSubscribe = Boolean(
    user?.me.subsriptions.find(subscribe => subscribe.id === +params.id)
  );

  return (
    <div className="bg-gray-900 h-screen text-white">
      <div className="p-4 border-b border-gray-600">
        <div className="flex">
          <img src="/podcast.svg" className="w-16 bg-gray-800 rounded-lg p-2" />
          <div className="ml-4">
            <div className="text-xl font-medium">
              {data?.getPodcast.podcast?.title}
            </div>
            <div className="text-xs text-gray-50 mt-1">
              CreateAt {getDate(data?.getPodcast.podcast?.createdAt)}
            </div>
            <div className="text-xs text-gray-50 mt-1">
              UpdateAt {getDate(data?.getPodcast.podcast?.updatedAt)}
            </div>
          </div>
        </div>
        <div className="flex mt-4 items-center">
          <div
            className={`py-1 px-4 border border-gray-600 rounded-full ${
              isSubscribe ? "bg-gray-500" : "bg-red-500"
            }`}
            onClick={onToggleSubscribeClick}
          >
            {isSubscribe ? "- UnSubscribe" : "+ Subscribe"}
          </div>
        </div>
      </div>
      <div className="p-4 text-2xl font-medium">
        {data?.getPodcast.podcast?.episodes.length} Episodes
      </div>
      {data?.getPodcast.podcast?.episodes.map(episode => (
        <div
          key={episode.id}
          className="p-4 border-b border-gray-600 flex flex-col items-start"
        >
          <div className="text-xs text-gray-50 font-light mb-1">
            {getDate(episode.createdAt)}
          </div>
          <div className="flex items-center mt-1">
            <div className="text-xl font-medium">{episode.title}</div>
            <div className="py-1 px-4 border border-gray-600 rounded-full text-xs ml-2">
              {episode.category}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
