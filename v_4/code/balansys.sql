#
# Decode the consumer from the image name. This will help in the population of
# the folder image reciept and consumer sub-model of the balansys database.
with 
    #
    # Discard the root and filter non pictures to get the base result
    base as(
        select 
            image,
            substring(full_name, 36) as name
        from 
            image
        where
            full_name like '%.jpg'
    ),
    #
    # Reverse the name so that the last backslash becomes the first
    reverse as(
        select
            image.image,
            image.full_name as original,
            reverse(base.name) as name
        from
            base
            inner join image on base.image = image.image
    ),
    #
    # Get the location,i.e., index of the first string 
    loc as(
        select 
            image,
            INSTR(name,'/') as loc
        from
            reverse
    ),
    #
    # Extract both the file name and the folder name from the reversed version using 
    # the location
    path as(
        select 
            reverse.original,
            reverse(substring(reverse.name, 1, loc.loc-1)) as file_name,
            reverse(substring(reverse.name,loc.loc+1)) as  folder_name
        from
            reverse
            inner join loc on loc.image = reverse.image
    ),
    #
    # List all the unique folders from the path
    folder as (
        select distinct
            folder_name
        from 
            path
    ),
    #
    # Recode the folders into consumers(using case statement)
    recode as(
        select
            folder_name,
            case
               when folder_name like 'kit%' then 'mutall'
               when folder_name like 'BMJ%' then 'bmj'
               when folder_name like 'bria%' then 'briabeauty'
               when folder_name like 'mali%' then 'malimali'
               when folder_name like 'trak%' then 'traking'
               else 'mutall'
            end as consumer
        from 
            folder
    ),
    #
    # Construct the final results by joining the recoded folders to the paths
    result as (
        select
            recode.consumer,
            path.original,
            path.folder_name,
            path.file_name
        from
            path
            inner join recode on recode.folder_name = path.folder_name
    )

select * from result