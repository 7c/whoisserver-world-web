import { Domainname, tldDetails, tlds } from '../src/index';

const output = document.querySelector<HTMLPreElement>('#output');
const parseDomainOutput = document.querySelector<HTMLPreElement>('#parseDomainOutput');

const allTlds = tlds();
const popular = ['com', 'net', 'org', 'dev', 'ai'].map((key) => ({
  tld: key,
  details: tldDetails(key)
}));

let parsed: Domainname | null = null;

try {
  parsed = new Domainname('main.registry.example.dev');
} catch (error) {
  console.error('Domain parsing failed', error);
}

const payload = {
  totalTlds: Object.keys(allTlds).length,
  sample: popular,
  parsed: parsed?.data ?? null,
  isValid: Domainname.isValid('main.registry.example.dev')
};

if (output) {
  output.textContent = JSON.stringify(payload, null, 2);
}

if (parseDomainOutput) {
  parseDomainOutput.textContent = parsed ? JSON.stringify(parsed.data, null, 2) : 'invalid domain';
}

console.log('WHOIS sample', parsed);
