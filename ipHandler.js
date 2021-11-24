const bcrypt = require('bcrypt');

const hashAndPushIP = async (doc, ip, saltRounds) => {
  const hash = await bcrypt.hash(ip, saltRounds);
  doc.ips.push(hash);
}

const compareMultipleIPs = async (num, arr, ip) => {
  if (num < 1) return false;
  const e = await bcrypt.compare(ip, arr[num - 1]);
  if (e) return true;
  return compareMultipleIPs(num - 1, arr, ip);
}

exports.hashAndPushIP = hashAndPushIP;
exports.compareMultipleIPs = compareMultipleIPs;