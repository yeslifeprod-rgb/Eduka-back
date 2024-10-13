export class UpdateProfileDto {
  firstname: string;
  lastname: string;
  photo: string;
  address_id: string; // Assuming you want to update address by its ID
  children: {
    id?: string; // Optional for new children (not yet created)
    name: string;
    birthday: string; // Ensure it is in 'YYYY-MM-DD' format
    class: string;
  }[];
}
