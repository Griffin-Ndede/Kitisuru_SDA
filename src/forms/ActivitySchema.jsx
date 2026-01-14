export const activityFields = {
  Child_dedication: [
  {
    name: "child_name",
    type: "text",
    label: "Full Name of Child",
    placeholder: "Enter child's full name",
    required: true,
  },
  {
    name: "child_dob",
    type: "date",
    label: "Date of Birth",
    required: true,
  },
  {
    name: "child_gender",
    type: "select",
    label: "Gender",
    placeholder: "Select gender",
    required: true,
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
  },

  /* Parents Section */
  {
    name: "mother_name",
    type: "text",
    label: "Mother's Full Name",
    placeholder: "Enter mother's full name",
  },
  {
    name: "mother_phone",
    type: "text",
    label: "Mother's Phone Number",
    placeholder: "Enter mother's phone number",
  },
  {
    name: "mother_email",
    type: "email",
    label: "Mother's Email (optional)",
    placeholder: "Enter mother's email",
  },

  {
    name: "father_name",
    type: "text",
    label: "Father's Full Name",
    placeholder: "Enter father's full name",
  },
  {
    name: "father_phone",
    type: "text",
    label: "Father's Phone Number",
    placeholder: "Enter father's phone number",
  },
  {
    name: "father_email",
    type: "email",
    label: "Father's Email (optional)",
    placeholder: "Enter father's email",
  },
  ],

    baptism: [
        {
            name: "preferred_date",
            type: "date",
            placeholder: "Preferred Baptism Date"
        },
    ],
    membership_transfer: [
        {
            name: "previous_church",
            type: "text",
            placeholder: "Previous Church Name"
        },
    ],

};