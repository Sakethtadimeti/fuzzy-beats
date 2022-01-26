const SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl";
let GoogleAuth;

const formatSnippets = (items) => {
  items.map((item) => {
    const { snippet, id, contentDetails } = item;
  });
};

const getLikedVideos = async () => {
  return getPlaylistVideos({fetchAll:false, playlistId : "LL" })
}
const getPlaylistVideos = async ({ pageToken, fetchAll = true, playlistId }) => {
  const payload = {
    part: ["contentDetails", "id", "snippet", "status"],
    maxResults: 50,
    playlistId,
  };
  if (pageToken) {
    payload.pageToken = pageToken;
  }
  const {
    result: { items, nextPageToken, pageInfo },
  } = await gapi.client.youtube.playlistItems.list(payload);
  const { resultsPerPage = 0, totalResults = 0 } = pageInfo;
  if (fetchAll && totalResults > 0 && nextPageToken) {
    const relayedItems = await getPlaylistVideos({
      pageToken: nextPageToken,
      fetchAll,
    });
    const allItems = items.concat(relayedItems);
    return allItems;
  }
  return items;
};

const fetchPlaylists = async () => {
  var user = GoogleAuth.currentUser.get();
  var isAuthorized = user.hasGrantedScopes(SCOPE);
  console.log({ isAuthorized, user });
  const {
    result: { items },
  } = await gapi.client.youtube.playlists.list({
    mine: true,
    part: [
      "snippet",
      "contentDetails",
      "id",
      "localizations",
      "player",
      "status",
    ],
  });
  const playlists = items.map((item) => ({
    title: item.snippet.title,
    description: item.snippet.description,
    player: item.player.embedHtml,
    id: item.id,
    label: item.snippet.title
  }));
  return playlists;
};

const onGoogleScriptsLoad = async () => {
  const updateSigninStatus = () => {
    console.log("Status changed");
  };
  gapi.load("client:auth2", initClient);
  async function initClient() {
    await gapi.client.init({
      apiKey: 'API_KEY_HERE',
      clientId:
        "CLIENT_ID_HERE",
      scope: SCOPE,
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
      ],
    });
    GoogleAuth = gapi.auth2.getAuthInstance();
    // Listen for sign-in state changes.
    GoogleAuth.isSignedIn.listen(updateSigninStatus);
    const user = GoogleAuth.currentUser.get();
    const isAuthorized = user.hasGrantedScopes(SCOPE);
    console.log({ isAuthorized, user });

    !isAuthorized && attemptSignIn();
  }
};

const attemptSignIn = async () => {
  await GoogleAuth.signIn();
};

const handleLogout = async () => {
  await GoogleAuth.signOut();
  console.log("Signed out", GoogleAuth, GoogleAuth.currentUser.get());
};
export {
  getLikedVideos,
  fetchPlaylists,
  onGoogleScriptsLoad,
  attemptSignIn,
  handleLogout,
  getPlaylistVideos
};
