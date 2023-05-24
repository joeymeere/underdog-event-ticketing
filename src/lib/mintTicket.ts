import axios from "axios";

export default async function mintTicket(
  eventName: string,
  image: string,
  location: string,
  time: string,
  publicKey: string,
  isTransferable: boolean,
  collectionId: number
) {
  let data = JSON.stringify({
    name: eventName,
    image: image,
    attributes: {
      Location: location,
      Time: time,
    },
    receiverAddress: publicKey,
  });

  if (isTransferable == true) {
    let config = {
      method: "post",
      url: `https://api.underdogprotocol.com/v2/projects/t/${collectionId}/nfts`,
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_UNDERDOG_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const res = await axios(config).catch((error) => {
      console.log(error);
    });

    //@ts-ignore
    let responseData = res.data;

    console.log(responseData);

    console.log("Ticket successfully minted.");

    return {
      mintAddress: responseData.mintAddress,
      nftId: responseData.id,
    };
  } else {
    let config = {
      method: "post",
      url: `https://api.underdogprotocol.com/v2/projects/n/${collectionId}/nfts`,
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_UNDERDOG_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const res = await axios(config).catch((error) => {
      console.log(error);
    });

    //@ts-ignore
    let responseData = res.data;

    console.log(responseData);

    console.log("Ticket successfully minted.");

    return {
      mintAddress: responseData.mintAddress,
      nftId: responseData.id,
    };
  }
}
