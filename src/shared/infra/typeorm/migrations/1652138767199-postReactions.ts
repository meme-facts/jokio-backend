import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class postReactions1652138767199 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'postReactions',
                columns: [
                    {
                        name:'id',
                        type: 'uuid',
                        isPrimary:true
                    },
                    {
                        name: 'reactionType',
                        type: 'char',
                    },
                    {
                        name: 'userId',
                        type: 'uuid'
                    },
                    {
                        name: 'postId',
                        type: 'uuid'
                    }, 
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    
                ],
                foreignKeys: [
                    {
                      name: 'FKUserPostReaction',
                      referencedTableName: 'users',
                      referencedColumnNames: ['id'],
                      columnNames: ['userId'],
                      onDelete: 'SET NULL',
                      onUpdate: 'SET NULL',
                    },
                    {
                      name: 'FKPostPostReaction',
                      referencedTableName: 'posts',
                      referencedColumnNames: ['id'],
                      columnNames: ['postId'],
                      onDelete: 'SET NULL',
                      onUpdate: 'SET NULL',
                    },
                  ],
            })
        )
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('postReactions');
    }

}
