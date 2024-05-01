param (
    [string]$slug,
    [string]$language = "zh-cn"
)

if ([string]::IsNullOrEmpty($slug)) {
    Write-Host "Please provide a slug for the post"
    exit
}

$post_dir = "content/$language/post/$slug"
$post_md = "$post_dir/index.md"

if (Test-Path $post_md) {
    Write-Host "Post already exists at $post_md"
    $old_date = Select-String -Path $post_md -Pattern "^date:" | % { $_.Line -replace "^date: *", "" }
    Write-Host "Old post date is $old_date"
    $update = Read-Host "Do you want to update the post date? [Y/n]"
    if ($update -ne "Y") {
        Write-Host "Nothing to be done, exiting"
        exit
    }
    $new_date = Get-Date -Format "yyyy-MM-dd HH:mm:sszzz"
    $new_date = $new_date -replace ":(?=\d{2}$)", ""
    (Get-Content $post_md) | ForEach-Object { $_ -replace "^date:.*$", "date: $new_date" } | Set-Content $post_md
    Write-Host "Post date updated to $new_date"
    exit
}

Write-Host "Creating post at $post_md"
$create = Read-Host "Do you want to create a new post with the slug $slug? [Y/n]"
if ($create -ne "Y") {
    Write-Host "Nothing to be done, exiting"
    exit
}

New-Item -ItemType Directory -Force -Path $post_dir
New-Item -ItemType File -Force -Path $post_md
$date = Get-Date -Format "yyyy-MM-dd HH:mm:sszzz"
$date = $date -replace ":(?=\d{2}$)", ""
@"
---
title: 
description: 
slug: $slug
date: $date
image: 
categories:
    - 
tags:
    - 
---
"@ | Set-Content $post_md

Write-Host "Post created at $post_md"