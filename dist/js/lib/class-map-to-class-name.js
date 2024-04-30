// takes in an Object of the form `{ 'class1 class2': true, 'class3': false }`
// where the Boolean true/false is determined at runtime
// based on conditions set in each Subclass's `_class()` method
//
// inspired by (but different than) Lit's [classMap](https://lit.dev/docs/templates/directives/#classmap) feature
export default function classMapToClassName(classObj) {
    return Object.entries(classObj)
        .map(([c, isActive]) => (isActive ? c : false))
        .filter(Boolean)
        .join(' ');
}
