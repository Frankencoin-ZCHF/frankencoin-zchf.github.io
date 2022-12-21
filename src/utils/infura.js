const topics = {
  Position: import.meta.env.VITE_APP_TOPIC_POSITION,
  ChallengeStarted: import.meta.env.VITE_APP_CHALLENGE_STARTED,
  ChallengeSucceeded: import.meta.env.VITE_APP_CHALLENGE_SUCCEEDED,
};

export default async (topic) => {
  if (!topics[topic]) return;

  const params = {
    jsonrpc: '2.0',
    method: 'eth_getLogs',
    params: [
      {
        fromBlock: 'earliest',
        toBlock: 'latest',
        topics: [topics[topic]],
      },
    ],
    id: 74,
  };

  const response = await fetch(
    `${import.meta.env.VITE_APP_INFURA_URL}/${
      import.meta.env.VITE_APP_INFURA_ID
    }`,
    {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
  );

  return await response.json();
};
