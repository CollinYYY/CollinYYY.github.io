export function unique (arr) {
  return Array.from(new Set(arr))
}

export function arraySome (arr1 = [], arr2 = []) {
  if (!arr1.length || !arr2.length) {
    return false;
  }

  for (let i = 0; i < arr2.length; i ++) {
    const item = arr2[i];
    if (arr1.includes(item)) {
      return true;
    }
  }

  return false;
}

export function arrayAll (arr1 = [], arr2 = []) {
  if (!arr1.length || !arr2.length) {
    return false;
  }

  for (let i = 0; i < arr2.length; i ++) {
    const item = arr2[i];
    if (!arr1.includes(item)) {
      return false;
    }
  }

  return true;
}