#!/bin/bash
language="$2"

if [ -z "$language" ]; then
    language="zh-cn"
fi

categories_dir="content/$language/categories"

if [ ! -d "$categories_dir" ]; then
    echo "No categories found at $categories_dir"
    exit 1
fi

ls "$categories_dir"