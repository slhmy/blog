#!/bin/bash
slug="$1"
language="$2"

if [ -z "$slug" ]; then
    echo "Please provide a slug for the post"
    exit 1
fi

if [ -z "$language" ]; then
    language="zh-cn"
fi

post_dir="content/$language/post/$slug"
mkdir -p "$post_dir"

post_md="$post_dir/index.md"
if [ -f "$post_md" ]; then
    echo "Post already exists at $post_md"
    old_date=$(grep "^date:" "$post_md" | sed "s/^date: *//")
    echo "Old post date is $old_date"
    echo "Do you want to update the post date? [Y/n]"
    read -r update
    if [ "$update" != "Y" ]; then
        echo "Nothing to be done, exiting"
        exit 1
    fi
    new_date=$(date +'%Y-%m-%d %H:%M:%S%z')
    sed -i "s/^date:.*$/date: $new_date/" "$post_md"
    echo "Post date updated to $new_date"
    exit 1
fi

touch "$post_md"
{
    echo "---"
    echo "title: "
    echo "description: "
    echo "slug: $slug"
    echo "date: $(date +'%Y-%m-%d %H:%M:%S%z')"
    echo "image: "
    echo "categories:"
    echo "    - "
    echo "tags:"
    echo "    - "
    echo "---"
} >"$post_md"

echo "Post created at $post_md"