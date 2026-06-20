/**
 * Utility to parse agent responses and identify structured components
 * like product listings and order receipts.
 */

// Matches lines like: #1. Organic Raw Honey (ID:1) — $14.99 ★4.63 — organic
// Handles variations in dashes (—, -, etc.) and stars (★, *, etc.)
const PRODUCT_REGEX_GLOBAL = /#(\d+)\.\s+([^(]+?)\s*\(ID:\s*(\d+)\)\s*(?:—|-)\s*\$(\d+(?:\.\d+)?)\s*(?:★|\*)\s*(\d+(?:\.\d+)?)\s*(?:—|-)\s*(organic|non-organic)/gi;
const PRODUCT_REGEX_SINGLE = /#(\d+)\.\s+([^(]+?)\s*\(ID:\s*(\d+)\)\s*(?:—|-)\s*\$(\d+(?:\.\d+)?)\s*(?:★|\*)\s*(\d+(?:\.\d+)?)\s*(?:—|-)\s*(organic|non-organic)/i;

// Matches order confirmations like: Order #3 confirmed! 'Creamed Honey' has been successfully ordered for $11.99.
const ORDER_REGEX = /Order\s+#(\d+)\s+confirmed!\s+['"]([^'"]+)['"]\s+has\s+been\s+successfully\s+ordered\s+for\s+\$(\d+(?:\.\d+)?)/i;

export function parseAgentMessage(text) {
  if (!text) return { type: 'text', content: '' };

  // 1. Check for Order Confirmation
  const orderMatch = text.match(ORDER_REGEX);
  if (orderMatch) {
    const [fullMatch, orderId, productName, price] = orderMatch;
    // Split the text around the order confirmation to keep surrounding text if any
    const index = text.indexOf(fullMatch);
    const beforeText = text.substring(0, index).trim();
    const afterText = text.substring(index + fullMatch.length).trim();
    
    return {
      type: 'receipt',
      content: {
        orderId,
        productName,
        price: parseFloat(price),
        rawMessage: text,
        beforeText,
        afterText
      }
    };
  }

  // 2. Check for Product Listings
  const matches = [...text.matchAll(PRODUCT_REGEX_GLOBAL)];
  if (matches.length > 0) {
    const products = matches.map(match => {
      const [raw, number, name, id, price, rating, organic] = match;
      return {
        raw,
        number: parseInt(number),
        name: name.trim(),
        id: parseInt(id),
        price: parseFloat(price),
        rating: parseFloat(rating),
        isOrganic: organic.toLowerCase() === 'organic'
      };
    });

    // Extract text before the first product and after the last product
    const firstMatchIndex = text.indexOf(matches[0][0]);
    const lastMatch = matches[matches.length - 1];
    const lastMatchEndIndex = text.indexOf(lastMatch[0]) + lastMatch[0].length;

    let beforeText = text.substring(0, firstMatchIndex).trim();
    let afterText = text.substring(lastMatchEndIndex).trim();

    // Clean up trailing and leading lines/dashes in surrounding text
    beforeText = beforeText.replace(/:\s*$/, ':'); // Keep colon at end of prepended text
    
    return {
      type: 'products',
      content: {
        products,
        beforeText,
        afterText
      }
    };
  }

  // 3. Fallback to Standard Text
  return {
    type: 'text',
    content: text
  };
}
