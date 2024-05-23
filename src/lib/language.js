export function replaceVariables(str, variables) {
  let newStr = str;
  variables.forEach((variable, index) => {
    newStr = newStr.replace(`&{${index}}`, variable); // &{index} is the placeholder for the variable
  });
  return newStr;
}

export function l(str, variables = []) {
    return replaceVariables(str, variables); // If the translation exists, and is not 
}
