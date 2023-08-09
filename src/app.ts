//////////////Decorators////////////////////
//Decoraters usually start with capital
function Logger(loggingString: string) {
  return function (constructor: Function) {
    console.log(loggingString);
    console.log(constructor);
  };
}

function withTemplate(template: string, hookId: string) {
  console.log("Template Factory");
  return function <T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T
  ) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
}

// @Logger("LOGGING - Person")
@Logger("Lorem ipsum")
@withTemplate("<h1>Power of decoraters<h1/>", "app")
class Person {
  name = "Max";

  constructor() {
    console.log("new person was created");
  }
}

const P1 = new Person();
console.log(P1);

//////////////

function Log(target: any, propertyName: string | number) {
  console.log("Property decorater!");
  console.log(target, propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("Accessor decorator zkoumám!!!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log3(
  target: any,
  name: string | symbol,
  descriptor: PropertyDescriptor
) {
  console.log("Method decorator To už nezkoumám!!!!!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log4(target: any, name: string | symbol, position: number) {
  console.log("parametr decorator");
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (this._price > 0) {
      this._price = val;
    } else {
      alert("Price must be positive!");
      throw new Error("Price must be positive!");
    }
  }

  constructor(t: string, p: number) {
    this._price = p;
    this.title = t;
  }
  @Log3
  getPrice(@Log4 tax: number) {
    return this.price * (1 + tax);
  }
}

const pr1 = new Product("kniha", 5);
const pr2 = new Product("kniha", 5);
console.log(pr1, pr2);

function Autobind(
  _: any,
  _2: string | symbol | number,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// class Printer {
//   message = "This work of the year!";
//   @Autobind
//   showMessage() {
//     console.log(this.message);
//   }
// }

// const p = new Printer();

// const button = document.querySelector("button");
// button?.addEventListener("click", p.showMessage);

interface ValidatorConfig {
  [property: string]: {
    [validateableProp: string]: string[]; //['required', 'positive']
  };
}

const registredValidator: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registredValidator[target.constructor.name] = {
    ...registredValidator[target.constructor.name],
    [propName]: [
      ...(registredValidator[target.constructor.name]?.[propName] ?? []),
      "required",
    ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registredValidator[target.constructor.name] = {
    ...registredValidator[target.constructor.name],
    [propName]: [
      ...(registredValidator[target.constructor.name]?.[propName] ?? []),
      "positive",
    ],
  };
}

function Validate(obj: any) {
  const objValidatorsConfig = registredValidator[obj.constructor.name];
  if (!objValidatorsConfig) {
    return true;
  }
  let isValid = true;
  for (const prop in objValidatorsConfig) {
    for (const validator of objValidatorsConfig[prop]) {
      switch (validator) {
        case "required":
          isValid = isValid && !!obj[prop];
          break;
        case "positive":
          isValid = isValid && obj[prop] > 0;
          break;
        default:
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.getElementById("formAko");

courseForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputTitle = document.getElementById("title") as HTMLInputElement;
  const inputPrice = document.getElementById("price") as HTMLInputElement;

  const title = inputTitle.value;
  const price = +inputPrice.value;

  const createCourse = new Course(title, price);
  if (!Validate(createCourse)) {
    alert("Invalid input! Please try again!");
    return;
  }
  console.log(createCourse);
});
