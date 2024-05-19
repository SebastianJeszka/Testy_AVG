export class TreeNode {
  name: string;
  isExpanded: boolean;
  children: TreeNode[] | null; // null when no children
}
