---
title: LeetCode题解
date: 2015-07-09
description: 不定期更新
---
##[Validate Binary Search Tree!](https://leetcode.com/problems/validate-binary-search-tree/)
> Given a binary tree, determine if it is a valid binary search tree (BST). Assume a BST is defined as follows:     

> - The left subtree of a node contains only nodes with keys less than the node's key.      
> - The right subtree of a node contains only nodes with keys greater than the node's key.      
> - Both the left and right subtrees must also be binary search trees.      

判定二叉树是否为二叉搜索树，代码如下：
{% highlight javascript %}
class Solution {
public:
    bool isValidBST(TreeNode* root) {
         return isValid(root, INT_MIN, INT_MAX);
     }
    
    bool isValid(TreeNode* root, int min, int max) {
        if(root == NULL) return true;
        
        if(root->val == INT_MIN && root->left != NULL) return false;
        if(root->val == INT_MAX && root->right != NULL) return false;
        
        if(root->val < min || root->val > max) {
            return false;
        }
        
        return isValid(root->left, min, root->val-1) && isValid(root->right, root->val+1, max);
    }
};
test
{% endhighlight %}


