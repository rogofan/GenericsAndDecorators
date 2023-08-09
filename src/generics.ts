// const names: Array<string> = ["Karlos", "Diana"];

// const promise: Promise<number> = new Promise((resolve, rejct) => {
//   setTimeout(() => {
//     // resolve("This is done!");
//     resolve(0);
//   }, 2000);
// });

// promise.then((data) => {
//   data.toFixed();
// });

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergeObj = merge({ name: "Karlos", age: 25 }, { name: "Diana", age: 30 });
console.log(mergeObj.age);

interface Lengthy {
  length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let description = "Got no value!";
  if (element.length === 1) {
    description = "Got 1 element";
  } else if (element.length > 1) {
    description = "Got " + element.length + " elemnts.";
  }
  return [element, description];
}

console.log(countAndDescribe("Hello there!"));

function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return "Value: " + obj[key];
}

console.log({}, "Name");

class DataStorage<T extends number | string | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }
  getItem() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();

textStorage.addItem("Karlos");
textStorage.addItem("Kormorán");
// textStorage.removeItem("koleno");
console.log(textStorage.getItem());

interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourse(title: string, description: string, date: Date) {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = "TS course" + title;
  courseGoal.description = "TS course from start to hero" + description;
  courseGoal.completeUntil = date;
  return courseGoal as CourseGoal;
}

const names: Readonly<string[]> = ["Karlos", "Diana"];
