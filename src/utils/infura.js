const topics = {
  Position:
    '0x591ede549d7e337ac63249acd2d7849532b0a686377bbf0b0cca6c8abd9552f2',
  ChallengeStarted:
    '0xc4b384b2c5ca32c8e77081f4083be594a1ea9ba34f208a9f9a458f70608585f5',
  ChallengeSucceeded:
    '0x05f9cc3345665aee5729d9564c27530d8b2ad3b4eb7e5d2503b15dc98498e726',
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
    'https://sepolia.infura.io/v3/692b1e384ae347e8b8e795d6df4fbc08',
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
