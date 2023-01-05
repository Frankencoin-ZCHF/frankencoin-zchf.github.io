import useContract from '@/composables/useContract';
import useLoading from '@/composables/useLoading';
import { dateFormatter } from '@/utils/date';
import { dec18ToString } from '@/utils/math';
import { ethers } from 'ethers';

export default (address, abi) => {
  const { contract } = useContract(address, abi);

  const { initRequest, endRequest } = useLoading();

  const one = async (arg, preventLoading = false) => {
    const key = Date.now() + Math.random();

    const config = {};

    if (typeof arg == 'string') {
      config.method = arg;
      config.formatter = 'text';
    } else if (typeof arg == 'object') {
      config.method = arg.method;
      config.formatter = arg.formatter;
      config.decimals = arg.decimals ? arg.decimals.value : 18;
      config.params = arg.params;
      config.fromUser = arg.fromUser;
    }

    if (!preventLoading)
      initRequest(key, address + ' ' + config.method + ' ' + config.params);

    let value;

    if (config.params) {
      value = await contract[config.method](...config.params);
    } else {
      value = await contract[config.method]();
    }

    if (!preventLoading) endRequest(key);

    switch (config.formatter) {
      case 'amount':
        return dec18ToString(value, config.decimals);
      case 'address':
        return ethers.utils.getAddress(value);
      case 'number':
        return Number(value);
      case 'date':
        return dateFormatter(value);
      default:
        return value;
    }
  };

  const all = async (requests) => {
    const requestsArray = [];

    const data = {};

    for (var key in requests) {
      if (Object.prototype.hasOwnProperty.call(requests, key)) {
        requests[key].key = key;
        requestsArray.push(requests[key]);
      }
    }

    await Promise.all(
      requestsArray.map(async (request) => {
        data[request.key] = await one(request);
      })
    );

    return data;
  };

  return {
    all,
    one,
    contract,
  };
};
