import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  getLikedVideos,
  fetchPlaylists,
  attemptSignIn,
  handleLogout,
  getPlaylistVideos,
} from "utils/google";
import ItemList from "components/item-list";
import Playlists from "components/playlist";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DragDropContext } from "react-beautiful-dnd";

const transfer = (oldList, newList, oldPosition, newPosition) => {
  const element = oldList[oldPosition];
  oldList.splice(oldPosition, 1);
  newList.splice(newPosition, 0, element);
  console.log({ oldList, newList });
};

const swap = (list, old, newPosition) => {
  console.log(list);
  const temp = list[old];
  list[old] = list[newPosition];
  list[newPosition] = temp;
  console.log(list);
};

export default function Home() {
  const [playlists, setPlayLists] = useState([]);
  const [playListVideos, setPlayListVideos] = useState([]);

  useEffect(() => {
    const fetchAllVideosAsync = async () => {
      const promises = playlists.map((playlist) => {
        return new Promise(async (resolve) => {
          const videos = await getPlaylistVideos({
            fetchAll: false,
            playlistId: playlist.id,
          });
          resolve({ id: playlist.id, videos });
        });
      });
      const response = await Promise.all(promises);
      const accumulatedPlaylists = response.reduce(
        (pre, playlist) => ({ ...pre, [playlist.id]: playlist.videos }),
        {}
      );
      setPlayListVideos(accumulatedPlaylists);
      sessionStorage.setItem(
        `playListVideos`,
        JSON.stringify(accumulatedPlaylists)
      );
    };
    fetchAllVideosAsync();
  }, [playlists]);
  useEffect(() => {
    const storedVideos = JSON.parse(
      window?.sessionStorage?.getItem(`playListVideos`)
    );
    setPlayListVideos(storedVideos ?? {});
  }, []);

  const handleGetPlaylistsClick = async () => {
    const playlists = await fetchPlaylists();
    playlists.push({
      title: "Liked Videos",
      description: "Your liked videos",
      player: "",
      id: "LL",
      label: "Liked Videos",
    });
    setPlayLists(playlists);
  };
  const onDragEnd = (event) => {
    const { destination, source, reason } = event;
    if (!destination) return;
    const { index: destinationIndex, droppableId: destinationDroppableId } =
      destination;
    const { index: sourceIndex, droppableId: sourceDroppableId } = source;
    if (
      sourceDroppableId === destinationDroppableId &&
      sourceIndex === destinationIndex
    )
      return;

    if (sourceDroppableId !== destinationDroppableId) {
      // switching between playlists
      transfer(
        playListVideos[sourceDroppableId],
        playListVideos[destinationDroppableId],
        sourceIndex,
        destinationIndex
      );
      playListVideos[sourceDroppableId] = [
        ...playListVideos[sourceDroppableId],
      ];
      playListVideos[destinationDroppableId] = [
        ...playListVideos[destinationDroppableId],
      ];
      setPlayListVideos({ ...playListVideos });
    } else if (sourceIndex !== destinationIndex) {
      // reorder the same playlist
      swap(playListVideos[sourceDroppableId], sourceIndex, destinationIndex);
      playListVideos[sourceDroppableId] = [
        ...playListVideos[sourceDroppableId],
      ];
      setPlayListVideos({ ...playListVideos });
    }
  };
  console.log(playListVideos);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <button onClick={handleLogout}>Log out</button>
      <button onClick={attemptSignIn}>Log In</button>
      <button onClick={handleGetPlaylistsClick}>Fetch playlists</button>
      <Playlists list={playlists} />
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {playlists?.map((playlist) => (
          <ItemList
            playlist={{ ...playlist, videos: playListVideos[playlist.id] }}
            key={playlist.id}
          />
        ))}
      </Box>
      {/* {playlists.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))} */}
    </DragDropContext>
  );
}
