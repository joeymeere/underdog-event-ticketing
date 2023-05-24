import axios from "axios";

export async function getClaimLink(projectId: number, nftId: number) {
  console.log("nftId:", nftId);
  let config = {
    method: "get",
    url: `https://api.underdogprotocol.com/v2/projects/n/${projectId}/nfts/${nftId}/claim`,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_UNDERDOG_API_KEY}`,
    },
  };

  const res = await axios(config).catch((error) => {
    console.log(error);
  });

  //@ts-ignore
  let responseData = res.data;

  console.log(responseData);

  return responseData.link;
}
