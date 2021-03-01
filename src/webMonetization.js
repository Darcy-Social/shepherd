function getWebMonetizationMetaTag() {
  const metaTags = document.getElementsByTagName('meta');
  for (let i = 0; i < metaTags.length; i++) {
    if (metaTags[i].getAttribute('name') === 'monetization') {
      return metaTags[i];
    }
  }
  return null;
}

function createWebMonetizationMetaTag() {
  const webMonetizationTag = document.createElement('meta');
  webMonetizationTag.setAttribute('name', 'monetization');
  document.head.appendChild(webMonetizationTag);
  return webMonetizationTag;
}

export function getPaymentPointer() {
  try {
    const tag = getWebMonetizationMetaTag();
    return tag && tag.getAttribute('content');
  } catch (e) {
    console.error('Failed to add web monetization tag to page header', e);
    return null;
  }
}

export function setPaymentPointer(newValue) {
  try {
    const tag = getWebMonetizationMetaTag() || createWebMonetizationMetaTag();
    tag.setAttribute('content', newValue || `$${window.location.host}`);
  } catch (e) {
    console.error('Failed to add web monetization tag to page header', e)
  }
}

export async function webIdToPaymentPointer(webId) {
  try {
    const res = await fetch(webId, {
      headers: {
        Accept: 'application/ld+json'
      }
    });
    const objs = await res.json();
    const obj = objs.find(obj => obj['@id'] === webId);
    const paymentPointerLinks = obj['http://paymentpointers.org/ns#PaymentPointer'];
    if (typeof paymentPointerLinks === 'undefined') {
      console.warn(`Author ${webId} has no <http://paymentpointers.org/ns#PaymentPointer> configured in their Solid profile`);
      return null;
    }
    return paymentPointerLinks[0]['@value'];
  } catch (e) {
    console.error(e);
  }
  return null;
}