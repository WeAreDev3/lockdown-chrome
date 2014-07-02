# Popup Page Specifications

## Signin & Signup Pages
- Both pages have a large header at the top containing the app logo/name.
- Each page has a respective sub-header titling the function of that page. When switching between pages, the text disappears by being cut off from top to bottom and replaced in the same fashion (appearing from top to bottom).
- When switching between the pages, the email box is either added or removed, thanks to a class that is also added or removed depending on the context.
- Labels fade in above their respective input boxes when text is added, and back out if all text is removed in a box.
- When the submit button is clicked, a clean loading animation (style to be determined) is added.
- If there are any errors in validation on any of the inputs, their labels are updated with the corresponding error, shown in a comfortable but noticeable red, alongside the original label, still shown in its original look. The error should read like a sentence. The error message should go away as soon as the error is fixed. To make things clearer for the user, the input box should also have a red outline or some other indicator.
- When the signin/signup is successful, the entire page (minus the header) slides off to the left. The header shrinks and adds the buttons necessary to the next page (like the menu icon).