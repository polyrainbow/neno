import subwaytext from "../index.js";

const input = `#Heading


#       another heading
some
multiline
text

-List
-  unordered
1.ordered list
2. another item
3..item3


/files/x
/files/y.mp3     Some description
here starts another paragraph

\`\`\`javascript
and here we have some multiline code


const x = [{}];
!@#$%&*()
\`\`\`

https://example.com Link to example.com
A paragraph with a https://link.com and a /slashlink`;

const START_TIME = performance.now();

for (let i = 0; i < 10000; i++) {
  subwaytext(input);
}

const END_TIME = performance.now();

const time = END_TIME - START_TIME;

// eslint-disable-next-line
console.log("Time: " + time);
