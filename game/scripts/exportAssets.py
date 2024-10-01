import os
import subprocess

input_dir = "../../assets/ase"
output_dir = "../src/assets"

aseprite_cli = "aseprite"

def export_aseprite_files():
    for root, dirs, files in os.walk(input_dir):
        for file in files:
            if file.endswith(".ase") or file.endswith(".aseprite"):
                input_file = os.path.join(root, file)

                output_image = os.path.join(output_dir, file.replace(".ase", ".png"))
                output_json = os.path.join(output_dir, file.replace(".ase", ".json"))
                command = [
                    aseprite_cli, "-b", input_file,
                    "--sheet", output_image,
                    "--data", output_json,
                    "--filename-format", "{tag}_{tagframe}",
                    # "--shape-padding", "1",
                    # "--sheet-pack",
                    "--list-tags",
                    # "--trim"
                ]

                with open(os.devnull, 'w') as null_file:
                    subprocess.run(command, stdout=null_file, stderr=null_file)

                print(f"Exported {input_file} to {output_dir}")

if __name__ == "__main__":
    export_aseprite_files()
