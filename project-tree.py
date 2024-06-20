import os

def tree(dir_path, indent=''):
    # Get the list of all files and directories in the given directory
    items = os.listdir(dir_path)
    
    # Iterate over each item
    for index, item in enumerate(items):
        # Check if it's the last item to use a different character
        if index == len(items) - 1:
            print(indent + '└── ' + item)
            new_indent = indent + '    '
        else:
            print(indent + '├── ' + item)
            new_indent = indent + '│   '
        
        # Get the full path of the item
        item_path = os.path.join(dir_path, item)
        
        # If it's a directory, recursively call the tree function
        if os.path.isdir(item_path):
            tree(item_path, new_indent)

# Call the tree function with the current directory
if __name__ == '__main__':
    project_root = os.path.dirname(os.path.abspath(__file__))
    print(project_root)
    tree(project_root)
