"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.substituteEnv = substituteEnv;exports.substituteEnvOnObject = substituteEnvOnObject;function substituteEnvOnObject(obj) {
  if ((obj === null || obj === void 0 ? void 0 : obj.constructor.name) !== 'Object') {
    return obj;
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[substituteEnv(key)] = substituteEnv(value);
    return acc;
  }, {});
}

function substituteEnv(valueIn) {
  if (Array.isArray(valueIn)) {
    return valueIn.map(substituteEnv);
  }
  if (valueIn.constructor.name === 'Object') {
    return substituteEnvOnObject(valueIn);
  }
  if (!valueIn || typeof valueIn !== 'string') {
    return valueIn;
  }



  const matches = valueIn.match(/(.?\${*[\w]*(?::-[\w/]*)?}*)/g) || [];

  return matches.reduce((newValue, match, index) => {
    const parts = /(.?)\${*([\w]*(?::-[\w/]*)?)?}*/g.exec(match);
    if (!parts || parts.length === 0) {
      return newValue;
    }

    const prefix = parts[1];
    let value, replacePart;

    if (prefix === '\\') {
      replacePart = parts[0];
      value = replacePart.replace('\\$', '$');
    } else {
      const keyParts = parts[2].split(':-');
      const key = keyParts[0];
      const defautValue = keyParts[1] || '';

      replacePart = parts[0].substring(prefix.length);
      value = Object.prototype.hasOwnProperty.call(process.env, key) ?
      process.env[key] :
      defautValue;


      if (keyParts.length > 1 && value) {
        const replaceNested = matches[index + 1];
        matches[index + 1] = '';

        newValue = newValue.replace(replaceNested, '');
      }

      value = substituteEnv(value);
    }

    return newValue.replace(replacePart, value);
  }, valueIn);
}