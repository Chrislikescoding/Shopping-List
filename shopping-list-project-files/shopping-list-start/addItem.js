const addItem = (e) => {
  e.preventDefault();

  if (itemInput.value === "") {
    alert("Please add an item");
    return;
  }
  console.log("success");
};
